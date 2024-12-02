import { GraphQLResolveInfo } from "graphql/type/definition";

export const zoneAuthMiddleware = async (
  resolve: (arg0: any, arg1: any, arg2: any, arg3: any) => any,
  root: any,
  args: { where: any },
  context: {
    user?: {
      FullName: string;
      Role: any;
      Family: {
        Rayon: number;
      };
    };
  },
  info: GraphQLResolveInfo
) => {
  const notAuthRequiredOperation = new Set(["registerNewUser", "login"]);

  const currentOperation = info?.fieldNodes[0]?.name?.value;
  const parent = info?.parentType?.name;

  if (context.user?.Role === "SUPERUSER") {
    return resolve(root, args, context, info);
  }

  if (notAuthRequiredOperation.has(currentOperation) && parent === "Mutation") {
    return resolve(root, args, context, info);
  }

  const userZone = context?.user?.Family.Rayon;

  console.log("INI ADALAH ZONA", userZone);

  if (parent === "Mutation" || parent === "Query") {
    if (!context?.user) {
      throw new Error("Zone filter requires authentication. Not authenticated");
    }

    if (!userZone) {
      throw new Error("User does not have a valid Zone");
    }
  }

  const zoneRestrictedOperation = new Set([
    "Query.queryGetMember",
    "Query.queryGetFamily",
    "Mutation.updateFamily",
    "Mutation.createFamily",
  ]);

  if (zoneRestrictedOperation.has(currentOperation)) {
    args.where = {
      ...args.where,
      Zones: userZone,
    };
  }

  console.log(
    `Applying Zone filter: ${userZone} for operation: ${currentOperation}`
  );

  return resolve(root, args, context, info);
};
