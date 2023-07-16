import { Layout } from '../components/Layout';
import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { css } from "../../styled-system/css/index.js";
// Popover.tsx
import * as Popover from '@radix-ui/react-popover';

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
    <Layout>
      <div className={css({ fontSize: "2xl", fontWeight: 'bold' })}>Home1</div>
      <PopoverComponent />
    </Layout>
  );
}

const PopoverComponent = () => (
  <Popover.Root>
    <Popover.Trigger className={css(triggerStyle)}>More info</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content className={css(contentStyle)}>
        Some more info…
        <Popover.Arrow className={css(arrowStyle)} />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

// style definitions
const triggerStyle = {
  backgroundColor: '#ddd',
  padding: '10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: '#ccc',
  }
};

const contentStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '20px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
};

const arrowStyle = {
  color: '#ddd',
};