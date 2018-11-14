import * as React from "react";
import * as ReactDOM from "react-dom";

import {Slide} from "./Slide";
import {HtmlSlide} from '../html/HtmlSlide';
import {Transformation} from '../html/transformations/Transformation';

export type InOut = "outAndInAtOnce" | "twin" | "firstOutThenIn";

export interface RenderOptions {
    slide: Slide,
    oldSlide?: Slide,
    safeMode?: boolean,
    inOut?: InOut,
    type?: string,
    transformInType?: Transformation,
    transformOutType?: Transformation,
}

const firstOutThenIn = (options: RenderOptions) => {
    const transformOutReady = new Promise(resolve => {
        ReactDOM.render(<HtmlSlide slide={options.oldSlide}
                                   safeMode={options.safeMode === true}
                                   action="transform-out"
                                   transformReadyCallback={resolve}
                                   transformType={options.transformOutType || "Right"}
        />, document.getElementById('root') as HTMLElement);
    })

    return new Promise(resolve => {
        transformOutReady.then(() => {
            ReactDOM.render(<HtmlSlide slide={options.slide}
                                       safeMode={options.safeMode === true}
                                       action="transform-in"
                                       transformReadyCallback={resolve}
                                       transformType={options.transformInType || "Left"}/>,
                document.getElementById('root') as HTMLElement);
        })
    })
}

const outAndInAtOnce = (options: RenderOptions) => {
    return new Promise(resolve => {
        ReactDOM.render(<HtmlSlide slideOut={options.oldSlide} slide={options.slide}
                                   safeMode={options.safeMode === true}
                                   action="transform-in-out"
                                   transformReadyCallback={resolve}
                                   transformOutType={options.transformOutType || "Right"}
                                   transformType={options.transformInType || "Left"}
        />, document.getElementById('root') as HTMLElement);
    })

}

const twin = (options: RenderOptions) => {
    const twinReady = new Promise(resolve => {
        ReactDOM.render(<HtmlSlide slideOut={options.oldSlide} slide={options.slide}
                                   safeMode={options.safeMode === true}
                                   action="twinMove"
                                   transformReadyCallback={resolve}
                                   transformType={options.transformInType || "RotateX"}
        />, document.getElementById('root') as HTMLElement);
    })

    return new Promise(resolve => {
        twinReady.then(() => {
            ReactDOM.render(<HtmlSlide slide={options.slide}
                                       safeMode={options.safeMode === true}
                                       transformReadyCallback={resolve}
                                       action="show"/>,
                document.getElementById('root') as HTMLElement);
        })
    })
}

export const renderSlide = (options: RenderOptions) => {
    console.log("render slide");
    if(options.oldSlide) {
        switch (options.inOut) {
            case "outAndInAtOnce":
                outAndInAtOnce(options);
                break;

            case "twin":
                twin(options);
                break;

            default:
                firstOutThenIn(options);
        }
    }
    else {
        ReactDOM.render(<HtmlSlide slide={options.slide} safeMode={options.safeMode === true} action="show"/>,
            document.getElementById('root') as HTMLElement);
    }
}

export const refreshSlide = (slide: Slide) => {
    ReactDOM.render(<HtmlSlide slide={slide} safeMode={true} action="refresh"/>,
        document.getElementById('root') as HTMLElement);
}