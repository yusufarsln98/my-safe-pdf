# Using Styled Components with Ant Design and Design Tokens

## Approach 1: Passing Tokens as Props

### Accessing Ant Design Tokens

```jsx
import { theme } from 'antd';
const { useToken } = theme;

function MyComponent() {
  const { token } = useToken();
  // Now you can use token.colorPrimary, token.borderRadius, etc.
}
```

### Creating Styled Components with Props

```jsx
// Define props interface for typed components
interface CounterTextProps {
  token?: GlobalToken
}

// Create a styled component that accepts tokens as props
const CounterText = styled.h2<CounterTextProps>`
  color: ${props => props.token?.purple};
  font-size: ${props => props.token?.fontSizeLG}px;
`;

// Use it in your component
function Counter() {
  const { token } = useToken();

  return (
    <CounterText token={token}>
      Count: 5
    </CounterText>
  );
}
```

## Approach 2: Using ThemeProvider

```jsx
import { ThemeProvider } from 'styled-components';
import { theme } from 'antd';

// Create a provider that makes tokens available to all styled components
const AntdThemeProvider = ({ children }) => {
  const { token } = theme.useToken();

  return (
    <ThemeProvider theme={token}>
      {children}
    </ThemeProvider>
  );
};

// Styled components can now access the theme directly
const Button = styled.button`
  background-color: ${props => props.theme.colorPrimary};
  border-radius: ${props => props.theme.borderRadius}px;
  padding: ${props => props.theme.paddingSM}px ${props => props.theme.padding}px;
`;

// Use in your app
function App() {
  return (
    <AntdThemeProvider>
      <Button>Themed Button</Button>
    </AntdThemeProvider>
  );
}
```

## Styling Components

### Ant Design Components

```jsx
// Style existing Ant Design components
const StyledCard = styled(Card)`
  width: 300px;
  box-shadow: ${props => props.theme.boxShadow};

  .ant-card-head-title {
    font-size: ${props => props.theme.fontSizeLG}px;
  }
`;

// Add dynamic styling based on props
const StyledButton = styled(Button)<{ danger?: boolean }>`
  background-color: ${props => props.danger ? props.theme.colorError : props.theme.colorPrimary};
`;
```

### HTML Elements

#### With Theme

```jsx
// Style HTML elements with theme
const Container = styled.div`
  background-color: ${props => props.theme.colorBgLayout};
  padding: ${props => props.theme.padding}px;
`;

const Heading = styled.h1`
  color: ${props => props.theme.colorTextHeading};
  font-size: ${props => props.theme.fontSizeHeading3}px;
  margin-bottom: ${props => props.theme.marginLG}px;
`;
```

#### Without Theme

```jsx
// Basic styled HTML elements (no theme dependency)
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

// With props but not theme-dependent
const Text = styled.p<{ bold?: boolean; size?: 'small' | 'medium' | 'large' }>`
  font-weight: ${props => props.bold ? 600 : 400};
  font-size: ${props => {
    switch(props.size) {
      case 'small': return '12px';
      case 'large': return '18px';
      default: return '14px';
    }
  }};
  line-height: 1.5;
`;
```

### Non-Ant Design Components

```jsx
// Third-party components
import { DatePicker } from 'react-datepicker';
import { motion } from 'framer-motion';

// Style third-party components
const StyledDatePicker = styled(DatePicker)`
  border: 1px solid ${props => props.theme.colorBorder};
  border-radius: ${props => props.theme.borderRadius}px;

  &:focus {
    border-color: ${props => props.theme.colorPrimary};
    box-shadow: 0 0 0 2px ${props => props.theme.colorPrimaryBg};
  }
`;

// Style animation components
const AnimatedBox = styled(motion.div)`
  background-color: ${props => props.theme.colorBgContainer};
  padding: ${props => props.theme.padding}px;
  border-radius: ${props => props.theme.borderRadiusLG}px;
`;

// Custom React components
const MyCustomComponent = ({ className, children }) => (
  <div className={className}>{children}</div>
);

const StyledCustomComponent = styled(MyCustomComponent)`
  color: ${props => props.theme.colorText};
  background-color: ${props => props.theme.colorBgContainer};
`;
```


## Common Token Properties

Frequently used Ant Design token properties:

- Colors: `colorPrimary`, `colorSuccess`, `colorWarning`, `colorError`
- Typography: `fontSizeHeading1`, `fontWeightStrong`, `lineHeight`
- Spacing: `marginXS`, `marginSM`, `marginMD`, `marginLG`
- Border: `borderRadius`, `borderRadiusLG`, `borderColorSplit`
- Shadows: `boxShadow`, `boxShadowSecondary`
