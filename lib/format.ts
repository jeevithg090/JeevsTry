export type BudgetType = "fixed" | "hourly"

/** Format a gig budget, e.g. "$5,000 fixed" or "$75/hr". */
export function formatBudget(amount: number, type: BudgetType): string {
  const value = `$${amount.toLocaleString("en-US")}`
  return type === "hourly" ? `${value}/hr` : `${value} fixed`
}
