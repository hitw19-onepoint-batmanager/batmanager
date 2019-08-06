using System;
using System.Collections.Generic;

namespace Robin
{
    class BatDocument
    {
        public string Id { get; set; }

        public string TimeStamp { get; set; }

        public string DeviceName { get; set; }

        public Byte[] SoundFile { get; set; }
        public string Username { get; set; }

        public DateTime ActiveNight { get; set; }

        public string _rev { get; set; }

        public string FilePath { get; set; }

    }
}

