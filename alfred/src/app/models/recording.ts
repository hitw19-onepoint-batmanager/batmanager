export interface Recording {
  _id: string;
  _rev: string;
  id: string;
  activeNight: string;
  timeStamp: string;
  deviceName: string;
  soundFile: Blob;
  username: string;
}
