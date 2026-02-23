import { HugeiconsIcon } from "@hugeicons/react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./ui/alert";
import { CircleAlert } from "@hugeicons/core-free-icons";
import { Button } from "./ui/button";
import { Link } from "@tanstack/react-router";

export default function ErrorAlert({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: { text: string; href: string };
}) {
  return (
    <div>
      <Alert variant="destructive">
        <HugeiconsIcon icon={CircleAlert} />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        <AlertAction>
          <Button variant="outline" asChild>
            <Link to={action.href}>{action.text}</Link>
          </Button>
        </AlertAction>
      </Alert>
    </div>
  );
}
