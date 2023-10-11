import { main as lambdaMain } from "./lambda.js";
import { APIGatewayEvent } from "aws-lambda";

async function main() {
    debugger;
    await lambdaMain({
        body: JSON.stringify({
            textToCheck: `Thier journey to the nearby city was quite the experience. If you could of seen the way people reacted when they first saw the castle, it was as if they were taken back to a era long forgotten. The architecture, with it's grand spires and ancient motifs, captured the essense of a time when knights roamed the land. The principle reason for visiting, however, was the art exhibition showcasing several peices from renowned artists of the past.`
        })
    } as any);
}

main().then(() => {
    console.log(`Done`);
}).catch((e) => {
    console.error(e);
    debugger;
});
