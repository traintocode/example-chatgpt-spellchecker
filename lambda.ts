import OpenAI from "openai";
import { APIGatewayEvent } from "aws-lambda";

type ReplacementsArgType = {
    changeFrom: string,
    changeTo: string,
    reason: "Grammar" | "Spelling"
}[]


// Entry point for AWS Lambda
export async function main({ body }: { body: string }) {
    
    // Read the text from the request body...
    const { textToCheck }: { textToCheck: string } = JSON.parse(body);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

    const prompt = 'Correct the spelling and grammatical errors in the following text:\n\n';

    const gptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        messages: [
            {
                role: "user",
                content: prompt + textToCheck
            }
        ],
        functions: [
            {
                name: "makeCorrections",
                description: "Makes spelling or grammar corrections to a body of text",
                parameters: {
                    type: "object",
                    properties: {
                        replacements: {
                            type: "array",
                            description: "Array of corrections",
                            items: {
                                type: "object",
                                properties: {
                                    changeFrom: {
                                        type: "string",
                                        description: "The word or phrase to change"
                                    },
                                    changeTo: {
                                        type: "string",
                                        description: "The new word or phrase to replace it with"
                                    },
                                    reason: {
                                        type: "string",
                                        description: "The reason this change is being made",
                                        enum: ["Grammar", "Spelling"]
                                    }                                    
                                }
                            }
                        }
                    }
                }
            }
        ],
        function_call: { name: 'makeCorrections' }
    });

    const [responseChoice] = gptResponse.choices;

    if (responseChoice.finish_reason !== "stop"
        || !responseChoice.message.function_call
        || !responseChoice.message.function_call.arguments
        || responseChoice.message.function_call.name !== 'makeCorrections') {
        console.log(responseChoice);
        throw new Error(`ChatGPT did not return the correct function call response for 'makeCorrections'. See logs for the actual response`);
    }

    console.log(gptResponse);
    const args = <ReplacementsArgType>JSON.parse(responseChoice.message.function_call!.arguments);
    console.log(args);
    debugger;

    return {
        statusCode: 200,
        body: JSON.stringify(args)
    };
}