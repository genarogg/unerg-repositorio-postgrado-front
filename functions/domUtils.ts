/* Obtiene el ide de un elemento */
const $ = (getId: string): HTMLElement | null => {
    return document.getElementById(getId);
};

/* Obtine todos los hijos de un elemento */
const $selectorAll = (getElement: string): NodeListOf<Element> => {
    return document.querySelectorAll(getElement);
};

/* devolvera la funcion de document.getElementById().classList */
const $classList = (getId: string): DOMTokenList | undefined => {
    const element = $(getId);
    return element ? element.classList : undefined;
};

const $style = (getId: string): CSSStyleDeclaration | undefined => {
    const element = $(getId);
    return element ? element.style : undefined;
};

/* Permite retirar una clase o añadir otra (al mismo elemento) */
const $toggleClass = (
    getId: string,
    aRemover: string,
    aAdd: string
): void => {
    const id = $classList(getId);
    if (!id) return;

    /* Clase a remover */
    if (id.contains(aRemover)) {
        id.remove(aRemover);
        id.add(aAdd);
    } else {
        id.add(aRemover);
        id.remove(aAdd);
    }
};

/* Oculta los elementos del dom */
const $fadeOut = (getId: string): void => {
    const id = $(getId);
    if (!id) return;

    id.style.opacity = "1";
    (function fade() {
        if (
            (id.style.opacity = (parseFloat(id.style.opacity) - 0.1).toString()) < "0"
        ) {
            id.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

/* Mostrar un elemento del dom */
const $fadeIn = (getId: string, display: string = "block"): void => {
    const id = $(getId);
    if (!id) return;

    id.style.opacity = "0";
    id.style.display = display;
    (function fade() {
        let val = parseFloat(id.style.opacity);
        if (!((val += 0.1) > 1)) {
            id.style.opacity = val.toString();
            requestAnimationFrame(fade);
        }
    })();
};

/* Oculta el elemento si es visible y lo muestra si es invisible */
const $toggleFade = (id: string, display: string = "block"): void => {
    const element = $(id);
    if (!element) return;

    if (element.style.display === "none" || element.style.opacity === "0") {
        $fadeIn(id, display);
    } else {
        $fadeOut(id);
    }
};

const $contains = (ids: string, clase: string): boolean => {
    const element = $(ids);
    return element ? element.classList.contains(clase) : false;
};

const $toggle = (id: string, css: string): boolean => {
    const classList = $classList(id);
    return classList ? classList.toggle(css) : false;
};

const $where = (css: string = ""): null => {
    document.body.removeAttribute("class");
    document.body.classList.add(css);
    return null;
};

export {
    $,
    $selectorAll,
    $classList,
    $style,
    $toggleClass,
    $fadeOut,
    $fadeIn,
    $toggleFade,
    $contains,
    $toggle,
    $where,
};
