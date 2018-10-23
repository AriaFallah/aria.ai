import { css } from "@emotion/core";

export const pageContainer = css`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const pageHeader = css`
  font-size: 2em;
`;

export const socialContainer = css`
  margin-bottom: 1em;
`;

export const socialLink = css`
  border-bottom: none;
  margin-right: 1em;

  &:last-child {
    margin-right: 0;
  }

  img {
    width: 25px;
  }
`;
