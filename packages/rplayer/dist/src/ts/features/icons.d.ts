declare const Icon: {
    register: typeof registerIcon;
    unregister: typeof unregisterIcon;
} & {
    [key: string]: (cls?: string) => HTMLElement;
};
declare function registerIcon(iconName: string, icon: (cls?: string) => HTMLElement): void;
declare function unregisterIcon(iconName: string): boolean;
export { Icon };
