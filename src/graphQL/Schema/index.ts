import { mergeTypeDefs } from "@graphql-tools/merge";

import { AuthenticationtypeDefs } from "./Authentication.Typedef";
import { leadersTypedef } from "./Leaders.Typedef";
import { attendeesTypedef } from "./Attendees.Typedef";
import { scheduleTypedef } from "./Schedule.Typedef";
import { familyTypedef } from "./Family.Typedef";
import { memberTypedef } from "./Member.Typdef";



const margeTypedef: any = mergeTypeDefs([
  attendeesTypedef,

  leadersTypedef,

  scheduleTypedef,

  familyTypedef,

  memberTypedef,

  AuthenticationtypeDefs,
]);

export default margeTypedef;
