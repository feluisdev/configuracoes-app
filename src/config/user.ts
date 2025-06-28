import { UserProps } from "@/features/users/types";

export const DEFAULT_IGRP_USER: UserProps = {
  igrpUsername: "igrp.user",
  fullname: "IGRP USER",
  email: "igrp.user@nosi.cv",
  roles: [],
  departments: [],
  apps: ['igrp-demo', 'igrp-test'],
  status: 'ACTIVE',
  signature: null,
  image:  null,
  picture: null,
}