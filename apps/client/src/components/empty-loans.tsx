import { BanknoteXIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const EmptyLoans = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BanknoteXIcon />
        </EmptyMedia>
        <EmptyTitle>No Loans Found</EmptyTitle>
        <EmptyDescription>
          {"You have no loans that are active."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Add Loan</Button>
          <Button>Log Out</Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};
