import { LoaderArgs } from '@remix-run/node';
import { getAuthenticator } from '../services/auth.server'

export let loader = ({ request, context }: LoaderArgs) => {
  console.log('[auth.google.callback] loader()', context);
  const authenticator = getAuthenticator(context)
  return authenticator.authenticate('google', request, {
    successRedirect: '/',
    failureRedirect: '/login',
  })
}