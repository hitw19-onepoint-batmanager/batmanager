using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Timers;
using System.Windows.Forms;
using Microsoft.Win32;
using MyCouch;
using MyCouch.Requests;
using Robin.Locales;
using Robin.Properties;
using Timer = System.Windows.Forms.Timer;

namespace Robin
{
    internal class Program : Form
    {
        private const int WM_DEVICECHANGE = 0x219;
        private const int DBT_DEVICEARRIVAL = 0x8000;
        private const int DBT_DEVICEREMOVECOMPLETE = 0x8004;
        private const int DBT_DEVTYP_VOLUME = 0x00000002;
        private const string dbname = "batcave";
        private MenuItem[] alerts;
        private bool hasChanged = false;
        private readonly ContextMenu menu;
        public static int FilesCountToProcess = 0;
        public static int FilesCountAlreadyDone = 0;
        public static string CurrentStatus;
        

        private readonly RegistryKey rk =
            Registry.CurrentUser.OpenSubKey("SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run", true);

        private bool runWithWindows;
        public readonly string targetPath = @"C:\Natagora";
        private Timer timer;
        public static string myKey;
        private readonly NotifyIcon tray;
        private readonly MenuItem[] userList;
        private readonly MenuItem[] manageUser;


        public Program()
        {
            tray = new NotifyIcon();
            tray.Icon = Icon.ExtractAssociatedIcon(Assembly.GetExecutingAssembly().Location);
            runWithWindows = rk.GetValue(Ressources.WinKeyRunWithWindows) != null ? true : false;
            //function shadow
            Helper.CreateRepository(targetPath);
            RestartDdl();
            Checkuser();


            menu = new ContextMenu();
            menu.MenuItems.Add(Ressources.MenuGetCurrentStatus, GetProgressStatusHandler);
            menu.MenuItems.Add(Ressources.MenuStartWithWindows, StartWithWindows);
            menu.MenuItems[1].Checked = runWithWindows;

            menu.MenuItems.Add(Ressources.MenuLogin + myKey);
            menu.MenuItems.Add(Ressources.MenuLogOut,LogOutHandler);
            menu.MenuItems.Add(Ressources.MenuCloseApp, Exit);
            tray.ContextMenu = menu;
            tray.Visible = true;
            tray.ShowBalloonTip(1500, Ressources.BalloonTrayTipTitleRobin, Ressources.BalloonTrayTextRobinIsRunning, ToolTipIcon.None);
        }

        private void LogOutHandler(object sender, EventArgs e)
        {
             RkHandler.LogOut(sender,e);
        }
        public void StartWithWindows(object sender, EventArgs e)
        {
            runWithWindows = !runWithWindows;
            if (runWithWindows) rk.SetValue(Ressources.BalloonTrayTipTitleRobin, "\"" + Application.ExecutablePath + "\"");
            else rk.DeleteValue(Ressources.BalloonTrayTipTitleRobin);
            menu.MenuItems[1].Checked = runWithWindows;
        }

        public static void Checkuser()
        {
            var rkey = Registry.CurrentUser.OpenSubKey("Natagora");
            if (rkey == null || (string)rkey.GetValue("username") == "")
            {
                Application.EnableVisualStyles();
                Application.Run(new NewUser());
                Checkuser();
            }
            else
            {
                myKey = (string)rkey.GetValue("Username");
            }
        }

        private static void Main(string[] args)
        {
            Application.Run(new Program());
        }

        protected override void OnLoad(EventArgs e)
        {
            CurrentStatus = Ressources.CurrentStatusIdle;
            Visible = false;
            ShowInTaskbar = false;
            base.OnLoad(e);
        }

        private async void GetProgressStatusHandler(object sender, EventArgs e)
        {
            await GetProgressStatus();
        }

        private async Task GetProgressStatus()
        {
            if (FilesCountToProcess == 0 && FilesCountAlreadyDone == 0)
            {
                tray.ShowBalloonTip(500, Ressources.BalloonTrayTipTitleStatusReporter, $"{CurrentStatus}", ToolTipIcon.None);
            }
            else
            {
                tray.ShowBalloonTip(500, Ressources.BalloonTrayTipTitleStatusReporter,
                    $" {CurrentStatus} and {FilesCountAlreadyDone} already upload out of {FilesCountToProcess}",
                    ToolTipIcon.None);
            }
        }

        private async Task GetAllFile()
        {
            var d = new DirectoryInfo(targetPath);
            var files = d.GetFiles("*.wav");
            var docList = new List<BatDocument>();
            CurrentStatus = Ressources.CurrentStatusDumpingFile;

            //To prevent username not set
            if (Settings.Default.UserName == null && myKey != null)
            {
                Settings.Default.UserName = myKey;
            }

            foreach (var file in files)
            {
                var fileWithoutExtention = Path.GetFileNameWithoutExtension(file.Name);
                var split = fileWithoutExtention.Split('_');
                var deviceName = split[0];
                var timestamp = fileWithoutExtention.Substring(fileWithoutExtention.LastIndexOf('-') + 3);
                var doc = new BatDocument
                {
                    Id = fileWithoutExtention,
                    DeviceName = deviceName,
                    TimeStamp = timestamp,
                    Username = Settings.Default.UserName,
                    SoundFile = File.ReadAllBytes(file.FullName),
                    FilePath = file.FullName,
                    ActiveNight = Helper.GetActiveNight(timestamp)
                };
                docList.Add(doc);
            }

            await UploadByteArrayToDb(await DBHandler(docList));
        }

        private static string FindUNCPaths()
        {
            var dis = DriveInfo.GetDrives();
            return (from di in dis
                where di.DriveType == DriveType.Removable
                select di.RootDirectory
                into dir
                select dir.FullName).FirstOrDefault();
        }

        protected override void WndProc(ref Message m)
        {
            base.WndProc(ref m);
            switch (m.Msg)
            {
                case WM_DEVICECHANGE:
                    switch ((int) m.WParam)
                    {
                        case DBT_DEVICEARRIVAL:
                       
                            //Notify when device is plugged in and dump it to the folder
                            CurrentStatus = Ressources.CurrentStatusDevicePlugIn;
                            FilesTreatment();
                            break;
                        case DBT_DEVICEREMOVECOMPLETE:
                            //notify when device in removed
                            CurrentStatus = Ressources.CurrentStatusDeviceRemoved;
                            tray.ShowBalloonTip(500, Ressources.BalloonTrayTipTitleRobin, Ressources.CurrentStatusDeviceRemoved, ToolTipIcon.None);
                            break;
                    }

                    break;
            }
        }

        protected void RestartDdl()
        {
            bool isEmpty = !Directory.EnumerateFiles(targetPath).Any();
            if (!isEmpty)
            {
                FilesTreatment();
            }
        }


        private async Task FilesTreatment()
        {
            tray.ShowBalloonTip(500, Ressources.BalloonTrayTipTitleRobin, Ressources.CurrentStatusDevicePlugIn, ToolTipIcon.None);
            bool doingThing = false;
            var path = FindUNCPaths();
            Regex reg = new Regex("(.+)_[0-9]{8}_[0-9]{6}.wav");

            var files = Directory.GetFiles(path, "*.wav", SearchOption.AllDirectories)
                .ToList().Where(d => reg.IsMatch(d)).ToList();

            Console.WriteLine(files.Count());

            if (files.Any())
            {

                CurrentStatus = Ressources.CurrentStatusDumpingFile;
                foreach (var s in files)
                    try
                    {
                        var fileName = Path.GetFileName(s);
                        var destFile = Path.Combine(targetPath, fileName ?? throw new InvalidOperationException());
                        if (!File.Exists(destFile))
                        {
                            File.Copy(s, destFile, true);
                            doingThing = true;
                        }

                        File.Delete(s); //TODO uncomment for delete on device
                    }
                    catch (Exception ex)
                    {
                        ShowBalloon(ex.Message);
                    }

                if (doingThing && Helper.IsDirectoryEmpty(targetPath))
                    tray.ShowBalloonTip(500, Ressources.BalloonTrayTipTitleRobin , Ressources.BalloonTrayTransferComplete, ToolTipIcon.None);}
            else
            {
                tray.ShowBalloonTip(500, Ressources.BalloonTrayTipTitleRobin, Ressources.BalloonTrayNoWavfilesFound, ToolTipIcon.None);
            }

            await GetAllFile();
        }

        private async Task<List<BatDocument>> DBHandler(List<BatDocument> docList = null)
        {
            CurrentStatus = Ressources.CurrentStatusImportDocToDb;
            var client = new MyCouchClient("<your-couchDB-endpoint>", dbname);

            if (docList == null) return null;
            foreach (var doc in docList)
            {
                var batDoc = new BatDocument
                {
                    DeviceName = doc.DeviceName,
                    TimeStamp = Helper.GetDatetimeToTimeStamp(doc.TimeStamp),
                    Username = doc.Username,
                    Id = doc.Id,
                    ActiveNight = Helper.GetActiveNight(doc.TimeStamp),
                };
                var res = await client.Entities.PostAsync(batDoc);
                doc._rev = res.Rev;
            }

            return docList;
        }

        private async Task UploadByteArrayToDb(List<BatDocument> docList)
        {
            CurrentStatus = Ressources.CurrentStatusUploadAudioToDb;
            var hasError = false;
            var hasDeleted = false;
            var client = new MyCouchClient("<your-couchDB-endpoint>", dbname);
            FilesCountToProcess = docList.Count();
            foreach (var doc in docList)
            {
                var request = new PutAttachmentRequest(
                    doc.Id,
                    doc._rev,
                    "SoundFile",
                    "application/zip",
                    Helper.GenerateZipFile(doc.SoundFile, doc.Id + ".wav"));

                var res = await client.Attachments.PutAsync(request);
                if (res.Error != null)
                {
                    hasError = true;
                    ShowBalloon($"Error : {res.Error}");
                }
                else
                {
                    hasDeleted = true;
                    File.Delete(doc.FilePath);
                }

                FilesCountAlreadyDone = docList.IndexOf(doc);
            }

            if (docList.Any() && hasDeleted)
                ShowBalloon(hasError ? Ressources.BalloonTrayTextUploadCompleteWithError : Ressources.BalloonTrayTextUploadComplete);

            FilesCountAlreadyDone = 0;
            FilesCountToProcess = 0;
            CurrentStatus = Ressources.CurrentStatusIdle;

        }


        public void ShowBalloon(string txt)
        {
            tray.ShowBalloonTip(500, Ressources.BalloonTrayTipTitleRobin, txt, ToolTipIcon.None);
        }

       

        private void Exit(object sender, EventArgs e)
        {
            Application.Exit();
        }

      

        protected override void Dispose(bool isDisposing)
        {
            if (isDisposing) tray.Dispose();
            base.Dispose(isDisposing);
        }

        private void InitializeComponent()
        {
            ClientSize = new Size(284, 262);
            Name = "Program";
            ResumeLayout(false);
        }
    }
}