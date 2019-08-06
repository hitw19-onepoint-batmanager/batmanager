using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Win32;
using Robin.Properties;

namespace Robin
{
    class RkHandler
    {

        public static void LogOut(object sender, EventArgs e)
        {
            string keyName = @"Natagora";
            using (RegistryKey key = Registry.CurrentUser.OpenSubKey(keyName, true))
            {
                if (key != null)
                {
                    key.SetValue("username", "");
                    Application.Exit();
                }
            }
        }
        //private void SetManageUSer(object sender, EventArgs e)
        //{
        //    var mi = (System.Windows.Forms.MenuItem)sender;
        //    foreach (var tmpmi in manageUser) tmpmi.Checked = false;
        //    mi.Checked = true;
        //    Settings.Default.ManageUser = myKey;
        //}

        //[Obsolete]
        //private void SetUsername(object sender, EventArgs e)
        //{
        //    var mi = (System.Windows.Forms.MenuItem)sender;
        //    foreach (var tmpmi in userList) tmpmi.Checked = false;
        //    mi.Checked = true;
        //    Settings.Default.UserName = mi.Text;
        //}
    }
}
