declare const Icon: {
    register: typeof registerIcon;
} & {
    [key: string]: <T extends Element>(cls?: string) => T;
};
declare function registerIcon(iconName: string, icon: (cls?: string) => any): void;
export { Icon };
