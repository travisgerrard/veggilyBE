import { DomUtils, parseDocument } from 'htmlparser2';
import he from 'he';
import { Document } from 'domhandler';
import axios, { AxiosError } from 'axios';

export function fetchPage(url: string): Promise<string | undefined> {
  const CORS_PROXY_API = `https://cors.ryanking13.workers.dev/?u=`;

  const HTMLData = axios
    // .get(`${CORS_PROXY_API}${url}`, {
    .get(`${url}`, {
      headers: {
        // tried to fake the user-agent but this didn't change anything

        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': '*',
      },
    })
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      console.error(`There was an error with ${error.config.url}.`);
      console.error(error.toJSON());
    });

  return HTMLData;
}

export type ScrapeRecipeLogger = (message: any) => void;

export interface RecipeSchema {
  name?: string;
  recipeIngredient?: string[];
  recipeInstructions?: string | Array<ListSchema | ListItemSchema | string>;
  prepTime?: string;
  cookTime?: string;
  image?:
    | string
    | string[]
    | {
        url: string;
      };
}

interface ListSchema {
  name: string;
  itemListElement: Array<ListItemSchema | string>;
}

interface ListItemSchema {
  text: string;
}

interface RecipeInstructionContent {
  text: string;
  bold: boolean;
  italic: boolean;
}

export interface ImportedRecipe {
  name: string;
  ingredients: Array<string>;
  instructions: RecipeInstructionContent[];
  // cookTime?: number;
  // prepTime?: number;
  // tags?: RecipeTag[];
  imageUrl?: string;
}

interface Thing {
  '@type': string;
}

type LinkedData = Thing[] | { '@graph': Thing[] } | Thing;

export function scrapeRecipe(
  html: string,
  log: ScrapeRecipeLogger
): ImportedRecipe {
  const document = parseDocument(html);

  const recipe = findJSONLD(document, log);

  if (recipe) {
    return recipe;
  }

  throw new Error('Could not find recipe data');
}

function findJSONLD(
  document: Document,
  log: ScrapeRecipeLogger
): ImportedRecipe | undefined {
  // Find JSON-LD scripts
  const scripts = DomUtils.findAll((element) => {
    if (element.type !== 'script') {
      return false;
    }

    return element.attribs.type === 'application/ld+json';
  }, document.children);

  // For every JS-LD script
  for (const script of scripts) {
    let data = JSON.parse(DomUtils.textContent(script)) as LinkedData;
    if ('@graph' in data) {
      data = data['@graph'];
    }

    // Try to find a recipe schema
    let recipeSchema: RecipeSchema | undefined;
    if (Array.isArray(data)) {
      recipeSchema = data.find(
        (item) => item['@type'] === 'Recipe'
      ) as RecipeSchema;
    } else if (data['@type'] === 'Recipe') {
      recipeSchema = data as RecipeSchema;
    }

    if (recipeSchema) {
      // And then map it
      return mapJSONLD(recipeSchema, log);
    }
  }
}

export function mapJSONLD(
  recipeSchema: RecipeSchema,
  log: ScrapeRecipeLogger
): ImportedRecipe {
  const ingredients: Array<string> = (recipeSchema.recipeIngredient ?? []).map(
    (ingredient) => {
      ingredient = cleanString(ingredient);

      return ingredient;
    }
  );

  const instructionContent: RecipeInstructionContent[] = getInstructions(
    recipeSchema,
    log
  ).map(({ text, ...options }) => {
    return {
      text: cleanString(text),
      ...options,
    };
  });

  return {
    name: recipeSchema.name ?? '',
    ingredients,
    instructions: instructionContent,
    imageUrl: getImageUrl(recipeSchema, log),
  };
}

function getInstructions(
  { recipeInstructions = [] }: RecipeSchema,
  log: ScrapeRecipeLogger
): RecipeInstructionContent[] {
  if (typeof recipeInstructions === 'string') {
    const startingTag =
      recipeInstructions.trim().substring(0, 3) + '>'.toLowerCase();
    if (startingTag !== '<ol>' && startingTag !== '<ul>') {
      log({
        message: 'Could not map unknown instruction string',
        instructions: recipeInstructions,
      });

      return [];
    }

    const document = parseDocument(recipeInstructions);
    return DomUtils.findAll(
      (element) => element.tagName === 'li',
      document.children
    ).map((item) => {
      const text = DomUtils.textContent(item);
      return { text, bold: false, italic: false };
    });
  }

  return recipeInstructions.reduce<RecipeInstructionContent[]>(
    (instructions, instruction) => {
      if (typeof instruction === 'string') {
        instructions.push({ text: instruction, bold: false, italic: false });
      } else if ('text' in instruction) {
        instructions.push({
          text: instruction.text,
          bold: false,
          italic: false,
        });
      } else if ('itemListElement' in instruction) {
        instructions.push({
          text: instruction.name,
          bold: true,
          italic: false,
        });

        instruction.itemListElement.forEach((item) => {
          if (typeof item === 'string') {
            instructions.push({ text: item, bold: false, italic: false });
          } else if ('text' in item) {
            instructions.push({ text: item.text, bold: false, italic: false });
          } else {
            log({
              message: 'Could not map instruction list item',
              instruction,
              item,
            });
          }
        });
      } else {
        log({
          message: 'Could not map instruction',
          instruction,
        });
      }

      return instructions;
    },
    []
  );
}

function getImageUrl(
  { image }: RecipeSchema,
  log: ScrapeRecipeLogger
): string | undefined {
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

function cleanString(value: string): string {
  // Naively remove html tags
  value = value.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '');

  // Decode HTML character references
  value = he.decode(value);

  // Remove weird whitespace characters
  value = value.replace(/\s/g, ' ');

  value = value.trim();

  return value;
}
