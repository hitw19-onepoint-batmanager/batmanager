using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Robin
{
    class Helper
    {

        public static byte[] GenerateZipFile(byte[] audioFile, string zipName)
        {
            using (var memoryStream = new MemoryStream())
            {
                using (var zipArchive = new ZipArchive(memoryStream, ZipArchiveMode.Create, leaveOpen: true))
                {
                    var zipEntry = zipArchive.CreateEntry(zipName);
                    using (Stream entryStream = zipEntry.Open())
                    {
                        entryStream.Write(audioFile, 0, audioFile.Length);
                    }
                }

                return memoryStream.ToArray();
            }
        }

        public static void CreateRepository(string targetPath)
        {
            if (!Directory.Exists(targetPath))
            {
                DirectoryInfo di = Directory.CreateDirectory(targetPath);
            }
        }

        public static string GetDatetimeToTimeStamp(string timestamp)
        {
            timestamp = timestamp.Replace("_", "");
            var year = Convert.ToInt32(timestamp.Substring(0, 4));
            var month = Convert.ToInt32(timestamp.Substring(4, 2));
            var day = Convert.ToInt32(timestamp.Substring(6, 2));
            var hour = Convert.ToInt32(timestamp.Substring(8, 2));
            var min = Convert.ToInt32(timestamp.Substring(10, 2));
            var sec = Convert.ToInt32(timestamp.Substring(12, 2));

            return new DateTime(year, month, day, hour, min, sec).ToString(CultureInfo.InvariantCulture);
        }

        public static DateTime GetActiveNight(string timestamp)
        {
            var date = Convert.ToDateTime(GetDatetimeToTimeStamp(timestamp));
            if (date.Hour < 12)
            {
                date = date.AddDays(-1);
            }

            return Convert.ToDateTime(date.ToShortDateString()).Date;
        }

        public static bool IsDirectoryEmpty(string path)
        {
            return !Directory.EnumerateFileSystemEntries(path).Any();
        }
    }
}
