export interface IMicrosoftAppsState{
    applications : {
        name: string,
        icon: string,
        link: string

    }[]

    pinned: boolean;
  onPinClick: () => void;
  onRemove: () => void;
}