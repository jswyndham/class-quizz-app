import { createSelector } from 'reselect';

export const selectMembershipDataArray = createSelector(
	(state) => state.membership.membershipById,
	(membershipById) => Object.values(membershipById)
);
