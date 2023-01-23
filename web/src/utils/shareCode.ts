import { deflateRaw, inflateRaw } from 'pako';

import { CreatorParams, programConvertor } from '@/lib/converter';
import { Statement } from '@/lib/models/editorObject';

export type ShareCodeParams = {
  code: string;
};

export const shareCode = {
  toUrlParams: (statements: Statement[]): ShareCodeParams => {
    const creatorParamsList = programConvertor.toCreatorParams(statements);
    return {
      code: encodeURIComponent(
        Buffer.from(
          deflateRaw(JSON.stringify({ 1: creatorParamsList }))
        ).toString('base64')
      ),
    };
  },
  fromUrlParams: (params: ShareCodeParams): CreatorParams[] => {
    try {
      const json = Buffer.from(
        inflateRaw(Buffer.from(decodeURIComponent(params.code), 'base64'))
      ).toString();
      return JSON.parse(json)['1'] as CreatorParams[];
    } catch {
      return [];
    }
  },
};
