import { BatDeviceLocation } from "./batdevicelocation";

export interface BatMapLocation {
    lat: number;
    lng: number;
    iconUrl: string;
    label: string;
    type: string;
    data?: BatDeviceLocation;
}
