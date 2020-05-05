import Component from '../component';
declare class Bar extends Component {
    constructor(className?: string, style?: Partial<CSSStyleDeclaration> | string);
    setX(x: number): void;
}
export default Bar;
