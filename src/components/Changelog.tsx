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
    <Accordion type="single" collapsible className="w-md">
      <AccordionItem value="changelog">
        <AccordionTrigger className="cursor-pointer">
          <h2 className="text-xl font-bold">Changelog</h2>
        </AccordionTrigger>
        <AccordionContent className="[&_h1]:hidden [&_h2]:text-xl [&_h3]:text-lg text-sm">
          <MDXChangelog />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
