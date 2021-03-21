declare const Icon: {
    register: typeof registerIcon;
    unregister: typeof unregisterIcon;
} & {
    [key: string]: (cls?: string, prefix?: string) => HTMLElement;
};
declare function registerIcon(iconName: string, icon: HTMLElement, prefix?: string): void;
declare function unregisterIcon(iconName: string): boolean;
export { Icon };
