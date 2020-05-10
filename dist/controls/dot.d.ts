import Component from '../component';
declare class Dot extends Component {
    constructor(className?: string, style?: Partial<CSSStyleDeclaration> | string);
    setX(x: number): void;
}
export default Dot;
