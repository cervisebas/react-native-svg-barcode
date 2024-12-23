import { StyleSheet, Text, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import type { BarcodeProps } from './Interfaces/Props';
import { useMemo } from 'react';
import barcodes from 'jsbarcode/src/barcodes';

export type { BarcodeProps };
export const Barcode = ({
  value = '',
  width = 2,
  height = 100,
  format = 'CODE128',
  lineColor = '#000000',
  background = '#ffffff',
  text,
  textStyle,
  style,
  onError,
  maxWidth,
}: BarcodeProps) => {
  const drawRect = (x: number, y: number, _width: number, _height: number) => {
    return `M${x},${y}h${_width}v${_height}h-${_width}z`;
  };

  const drawSvgBarCode = (encoded: any) => {
    const rects = [];
    const { data: binary } = encoded;

    const barCodeWidth = binary.length * width;
    const singleBarWidth =
      typeof maxWidth === 'number' && barCodeWidth > maxWidth
        ? maxWidth / binary.length
        : width;
    let barWidth = 0;
    let x = 0;
    let yFrom = 0;

    for (let b = 0; b < binary.length; b++) {
      x = b * singleBarWidth;
      if (binary[b] === '1') {
        barWidth++;
      } else if (barWidth > 0) {
        rects[rects.length] = drawRect(
          x - singleBarWidth * barWidth,
          yFrom,
          singleBarWidth * barWidth,
          height
        );
        barWidth = 0;
      }
    }

    if (barWidth > 0) {
      rects[rects.length] = drawRect(
        x - singleBarWidth * (barWidth - 1),
        yFrom,
        singleBarWidth * barWidth,
        height
      );
    }

    return rects;
  };

  const encode = (_text: string, Encoder: any) => {
    if (typeof _text !== 'string' || _text.length === 0) {
      throw new Error('Barcode value must be a non-empty string');
    }
    const encoder = new Encoder(_text, {
      width,
      format,
      height,
      lineColor,
      background,
      flat: true,
    });
    if (!encoder.valid()) {
      throw new Error('Invalid barcode for selected format.');
    }
    return encoder.encode();
  };

  const { bars, barCodeWidth } = useMemo(() => {
    try {
      const encoder = barcodes[format];
      if (!encoder) {
        throw new Error('Invalid barcode format.');
      }
      const encoded = encode(value, encoder);
      const _barCodeWidth = encoded.data.length * width;
      return {
        bars: drawSvgBarCode(encoded),
        barCodeWidth:
          typeof maxWidth === 'number' && _barCodeWidth > maxWidth
            ? maxWidth
            : _barCodeWidth,
      };
    } catch (error) {
      if (__DEV__) {
        console.error((error as any).message);
      }
      if (onError) {
        onError(error);
      }
    }
    return {
      bars: [],
      barCodeWidth: 0,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, width, height, format, lineColor, background, maxWidth]);

  return (
    <View style={[{ backgroundColor: background }, styles.content, style]}>
      <Svg height={height} width={barCodeWidth} fill={lineColor}>
        <Path d={bars.join(' ')} />
      </Svg>
      {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
