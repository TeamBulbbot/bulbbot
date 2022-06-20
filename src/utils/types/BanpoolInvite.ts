export type BanpoolInvite = {
	guild: {
		id: Maybe<string>;
		name: Maybe<string>;
	};
	inviter: {
		tag: string;
		id: string;
	};
	banpool: {
		name: string;
		code: string;
		expires: number;
	};
};
