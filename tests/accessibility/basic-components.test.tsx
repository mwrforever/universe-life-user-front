import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithAccessibility, createAccessibilityTestSuite } from '../utils/accessibility';

// 模拟基本组件
const Button = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
  <button onClick={onClick}>{children}</button>
);

const Input = ({ label, placeholder }: { label: string; placeholder: string }) => (
  <div>
    <label htmlFor="test-input">{label}</label>
    <input id="test-input" placeholder={placeholder} />
  </div>
);

const Heading = ({ level, children }: { level: number; children: React.ReactNode }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag>{children}</Tag>;
};

const Image = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} />
);

describe('Accessibility Tests', () => {
  describe('Button Component', () => {
    let container: HTMLElement;

    beforeEach(() => {
      const { container: renderContainer } = renderWithAccessibility(
        <Button onClick={() => {}}>Test Button</Button>
      );
      container = renderContainer;
    });

    it('should be accessible via keyboard', () => {
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    it('should have proper ARIA role', () => {
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should have accessible text', () => {
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Test Button');
    });
  });

  describe('Input Component', () => {
    beforeEach(() => {
      renderWithAccessibility(
        <Input label="Test Label" placeholder="Enter text" />
      );
    });

    it('should have associated label', () => {
      const input = screen.getByRole('textbox');
      const label = screen.getByLabelText('Test Label');
      expect(label).toBeInTheDocument();
      expect(input).toBeInTheDocument();
    });

    it('should have placeholder text', () => {
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Heading Component', () => {
    beforeEach(() => {
      renderWithAccessibility(
        <div>
          <Heading level={1}>Main Title</Heading>
          <Heading level={2}>Subtitle</Heading>
          <Heading level={3}>Section Title</Heading>
        </div>
      );
    });

    it('should have proper heading hierarchy', () => {
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      const h3 = screen.getByRole('heading', { level: 3 });

      expect(h1).toHaveTextContent('Main Title');
      expect(h2).toHaveTextContent('Subtitle');
      expect(h3).toHaveTextContent('Section Title');
    });
  });

  describe('Image Component', () => {
    beforeEach(() => {
      renderWithAccessibility(
        <Image src="/test-image.jpg" alt="Test image description" />
      );
    });

    it('should have alt text', () => {
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('alt', 'Test image description');
    });
  });

  describe('Complex Component Integration', () => {
    beforeEach(() => {
      renderWithAccessibility(
        <div>
          <header>
            <h1>Application Title</h1>
            <nav>
              <button>Home</button>
              <button>About</button>
              <button>Contact</button>
            </nav>
          </header>
          <main>
            <h2>Main Content</h2>
            <form>
              <Input label="Username" placeholder="Enter username" />
              <Input label="Password" placeholder="Enter password" />
              <button type="submit">Submit</button>
            </form>
            <section>
              <h3>Additional Information</h3>
              <Image src="/info-image.jpg" alt="Information diagram" />
              <p>Some descriptive text here.</p>
              <a href="/more-info">Learn more</a>
            </section>
          </main>
          <footer>
            <p>&copy; 2024 Test Application</p>
          </footer>
        </div>
      );
    });

    it('should have proper semantic structure', () => {
      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    });

    it('should have only one main landmark', () => {
      const mains = screen.getAllByRole('main');
      expect(mains).toHaveLength(1);
    });

    it('should have proper form structure', () => {
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });
  });
});