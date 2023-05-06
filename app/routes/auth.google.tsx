import { redirect, type ActionArgs } from "@remix-run/cloudflare";
import { getAuthenticator } from '~/services/auth.server'

export const loader = () => redirect('/login')

export const action = ({ request, context }: ActionArgs) => {
  // console.log('[auth.google] action()', context);
  const authenticator = getAuthenticator(context);
  return authenticator.authenticate('google', request, {
    successRedirect: '/',
    failureRedirect: '/login',
  })
}