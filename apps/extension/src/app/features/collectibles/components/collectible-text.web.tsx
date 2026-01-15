import { Box, styled } from 'leather-styles/jsx';

import { Iframe } from '@app/ui/components/iframe';

import { CollectibleCard } from './collectible-card.web';

interface CollectibleTextProps {
  src: string;
  height?: number;
  onPress?(): void;
}

const htmlRegex = /<\w+[\s\S]*?>/;

function createHtmlDataUrl(html: string): string {
  // Use <pre> with monospace font to render text inscriptions as before
  const wrappedHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      margin: 0;
      padding: 16px;
      background: #12100f;
      color: #f5f1ed;
      overflow: hidden;
    }
    pre {
      margin: 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Liberation Mono", "Courier New", monospace;
      font-size: 15px;
      background: none;
      color: #f5f1ed;
      white-space: pre-wrap;
      word-break: break-word;
    }
  </style>
</head>
<body><pre>${html}</pre></body>
</html>`;
  return `data:text/html;charset=utf-8,${encodeURIComponent(wrappedHtml)}`;
}

interface HtmlContentProps {
  dataUrl: string;
  height: number;
}

function HtmlContent({ dataUrl, height }: HtmlContentProps) {
  return (
    <Box height={height} overflow="hidden">
      <Iframe
        src={dataUrl}
        height="100%"
        width="100%"
        onError={() => {
          // Silently handle errors - the iframe will show blank
        }}
      />
    </Box>
  );
}

function formatText(src: string): string {
  try {
    const parsed = JSON.parse(src);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return src;
  }
}

interface PlainTextContentProps {
  src: string;
  height: number;
}

function PlainTextContent({ src, height }: PlainTextContentProps) {
  return (
    <Box bg="ink.text-primary" height={height} overflow="hidden" p="space.04">
      <styled.pre color="ink.background-secondary" fontFamily="mono" fontSize="sm">
        {formatText(src)}
      </styled.pre>
    </Box>
  );
}

interface CollectibleContentWrapperProps {
  height: number;
  onPress?(): void;
  children: React.ReactNode;
}

function CollectibleContentWrapper({ height, onPress, children }: CollectibleContentWrapperProps) {
  if (onPress) {
    return (
      <CollectibleCard height={height}>
        <styled.button
          type="button"
          onClick={onPress}
          border="none"
          p={0}
          m={0}
          bg="transparent"
          width="100%"
        >
          {children}
        </styled.button>
      </CollectibleCard>
    );
  }

  return <CollectibleCard height={height}>{children}</CollectibleCard>;
}

export function CollectibleText({ src, height = 200, onPress }: CollectibleTextProps) {
  const preview = typeof src === 'string' ? src.slice(0, 512) : '';
  const isHtml = htmlRegex.test(preview);
  const dataUrl = isHtml ? createHtmlDataUrl(src) : null;

  return (
    <CollectibleContentWrapper height={height} onPress={onPress}>
      {isHtml && dataUrl ? (
        <HtmlContent dataUrl={dataUrl} height={height} />
      ) : (
        <PlainTextContent src={src} height={height} />
      )}
    </CollectibleContentWrapper>
  );
}
