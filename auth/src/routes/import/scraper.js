"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapJSONLD = exports.scrapeRecipe = exports.fetchPage = void 0;
const htmlparser2_1 = require("htmlparser2");
const he_1 = __importDefault(require("he"));
const axios_1 = __importDefault(require("axios"));
function fetchPage(url) {
    const CORS_PROXY_API = `https://cors.ryanking13.workers.dev/?u=`;
    const HTMLData = axios_1.default
        // .get(`${CORS_PROXY_API}${url}`, {
        .get(`${url}`, {
        headers: {
            // tried to fake the user-agent but this didn't change anything
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': '*',
        },
    })
        .then((res) => res.data)
        .catch((error) => {
        console.error(`There was an error with ${error.config.url}.`);
        console.error(error.toJSON());
    });
    return HTMLData;
}
exports.fetchPage = fetchPage;
function scrapeRecipe(html, log) {
    const document = (0, htmlparser2_1.parseDocument)(html);
    const recipe = findJSONLD(document, log);
    if (recipe) {
        return recipe;
    }
    throw new Error('Could not find recipe data');
}
exports.scrapeRecipe = scrapeRecipe;
function findJSONLD(document, log) {
    // Find JSON-LD scripts
    const scripts = htmlparser2_1.DomUtils.findAll((element) => {
        if (element.type !== 'script') {
            return false;
        }
        return element.attribs.type === 'application/ld+json';
    }, document.children);
    // For every JS-LD script
    for (const script of scripts) {
        let data = JSON.parse(htmlparser2_1.DomUtils.textContent(script));
        if ('@graph' in data) {
            data = data['@graph'];
        }
        // Try to find a recipe schema
        let recipeSchema;
        if (Array.isArray(data)) {
            recipeSchema = data.find((item) => item['@type'] === 'Recipe');
        }
        else if (data['@type'] === 'Recipe') {
            recipeSchema = data;
        }
        if (recipeSchema) {
            // And then map it
            return mapJSONLD(recipeSchema, log);
        }
    }
}
function mapJSONLD(recipeSchema, log) {
    var _a, _b;
    const ingredients = ((_a = recipeSchema.recipeIngredient) !== null && _a !== void 0 ? _a : []).map((ingredient) => {
        ingredient = cleanString(ingredient);
        return ingredient;
    });
    const instructionContent = getInstructions(recipeSchema, log).map(({ text, ...options }) => {
        return {
            text: cleanString(text),
            ...options,
        };
    });
    return {
        name: (_b = recipeSchema.name) !== null && _b !== void 0 ? _b : '',
        ingredients,
        instructions: instructionContent,
        imageUrl: getImageUrl(recipeSchema, log),
    };
}
exports.mapJSONLD = mapJSONLD;
function getInstructions({ recipeInstructions = [] }, log) {
    if (typeof recipeInstructions === 'string') {
        const startingTag = recipeInstructions.trim().substring(0, 3) + '>'.toLowerCase();
        if (startingTag !== '<ol>' && startingTag !== '<ul>') {
            log({
                message: 'Could not map unknown instruction string',
                instructions: recipeInstructions,
            });
            return [];
        }
        const document = (0, htmlparser2_1.parseDocument)(recipeInstructions);
        return htmlparser2_1.DomUtils.findAll((element) => element.tagName === 'li', document.children).map((item) => {
            const text = htmlparser2_1.DomUtils.textContent(item);
            return { text, bold: false, italic: false };
        });
    }
    return recipeInstructions.reduce((instructions, instruction) => {
        if (typeof instruction === 'string') {
            instructions.push({ text: instruction, bold: false, italic: false });
        }
        else if ('text' in instruction) {
            instructions.push({
                text: instruction.text,
                bold: false,
                italic: false,
            });
        }
        else if ('itemListElement' in instruction) {
            instructions.push({
                text: instruction.name,
                bold: true,
                italic: false,
            });
            instruction.itemListElement.forEach((item) => {
                if (typeof item === 'string') {
                    instructions.push({ text: item, bold: false, italic: false });
                }
                else if ('text' in item) {
                    instructions.push({ text: item.text, bold: false, italic: false });
                }
                else {
                    log({
                        message: 'Could not map instruction list item',
                        instruction,
                        item,
                    });
                }
            });
        }
        else {
            log({
                message: 'Could not map instruction',
                instruction,
            });
        }
        return instructions;
    }, []);
}
function getImageUrl({ image }, log) {
    if (!image) {
        return;
    }
    if (typeof image === 'string') {
        return image;
    }
    if (Array.isArray(image)) {
        return image[0];
    }
    if (image.url) {
        return image.url;
    }
    log({ message: 'Could not map image url', image });
}
function cleanString(value) {
    // Naively remove html tags
    value = value.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '');
    // Decode HTML character references
    value = he_1.default.decode(value);
    // Remove weird whitespace characters
    value = value.replace(/\s/g, ' ');
    value = value.trim();
    return value;
}
