import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

export const GqlAuthGuard = (name) =>
	class GqlAuthRefreshGuard extends AuthGuard(name) {
		getRequest(context: ExecutionContext) {
			const gqlContext = GqlExecutionContext.create(context);
			return gqlContext.getContext().req;
		}
	};
