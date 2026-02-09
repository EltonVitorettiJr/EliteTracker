import type * as zod from "zod";

/*
  join() serve para transformar o array em string (ex: ["a", "b", "c"] => "a,b,c")
  a separação feita por "." serve para mostrar o caminho dos dados
  ex: se tivéssemos um objeto com o nome "user" e o campo "name", o caminho exibido seria "user.name"
*/
export default function buildValidationErrorMessage(
  issues: zod.core.$ZodIssue[],
): string[] {
  const errors = issues.map(
    (issue) => `${issue.path.join(".")}: ${issue.message}`,
  );
  return errors;
}
