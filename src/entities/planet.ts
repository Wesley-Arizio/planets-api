import { Decimal } from "@prisma/client/runtime/library";

export interface Planet {
  id: string;
  name: string;
  mass: Decimal;
}
