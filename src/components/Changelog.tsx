import { Card, CardContent } from "./ui/card";
// @ts-ignore
import MDXChangelog from "/CHANGELOG.md";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export default function Changelog() {
  return (
    <Card>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="changelog">
            <AccordionTrigger>
              <h2 className="text-xl font-bold">Changelog</h2>
            </AccordionTrigger>
            <AccordionContent className="[&_h1]:hidden [&_h2]:text-xl [&_h3]:text-lg text-sm">
              <MDXChangelog />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
