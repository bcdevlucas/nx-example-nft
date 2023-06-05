import { ConfigEnum } from '../types/config-enum.type';

// TODO: Dynamic roles?
const API_ROLES = ['guest', 'free', 'subscriber', 'admin'] as const;

export type ApiRolesType = ConfigEnum<typeof API_ROLES>;
const [guest, free, subscriber, admin] = API_ROLES;

const apiRoles = { guest, free, subscriber, admin } as const;

export { apiRoles, API_ROLES };
