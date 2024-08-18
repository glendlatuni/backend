
import { GraphQLResolveInfo } from "graphql/type/definition";

export const zoneAuthMiddleware = async (
  resolve: (arg0: any, arg1: any, arg2: any, arg3: any) => any,
  root: any,
  args: { where: any },
  context: { user?: {  Zones: any, FullName: any, Role: any } } ,
  info: GraphQLResolveInfo
) => {

  if (context.user?.Role === "SUPERUSER") {
    console.log("you are SUPERUSER");
    
    return resolve(root, args, context, info);
  }

  console.log("you are :", context.user?.FullName);
  console.log("YOUR RULE :", context.user);
  console.log("you are looking for data at zone ", context.user?.Zones);


  const notAuthRequiredOperation = new Set(["registerNewUser", "login"]);

  const currentOperation = info?.fieldNodes[0]?.name?.value;
  const parent = info?.parentType?.name;

  console.log(`Current operation: ${currentOperation}`);
  console.log(`Parent type: ${parent}`);



  // Periksa apakah operasi saat ini adalah operasi yang tidak memerlukan autentikasi
  if (notAuthRequiredOperation.has(currentOperation) && parent === "Mutation") {
    return resolve(root, args, context, info);
  }

  // deklarasi variabel user beradsarkan zona
  const userZone = context?.user?.Zones;


  // Jika bukan operasi yang dikecualikan, periksa autentikasi
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
