export interface NPlayerVueOptions {
    name?: string;
}
declare const plugin: {
    install(app: any, opts?: NPlayerVueOptions): void;
};
export default plugin;
export { plugin as Plugin };
