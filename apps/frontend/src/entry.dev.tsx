import { render } from '@builder.io/qwik';
import Root from './root';

export default function () {
  const container = document.getElementById('app');
  if (!container) {
    throw new Error('Container element #app not found');
  }
  return render(container, <Root />);
}