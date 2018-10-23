import { css } from "@emotion/core";
import styled from "@emotion/styled";

interface NavLinkProps {
  active: boolean;
}

export const NavLink = styled.a`
  border-bottom: 0;
  margin-right: 1em;

  background-color: ${(props: NavLinkProps) => (!props.active ? "" : "black")};
  color: ${props => (!props.active ? "black" : "white")} !important;
  padding-left: ${props => (!props.active ? "0" : "5px")};
  padding-right: ${props => (!props.active ? "0" : "8px")};
  font-style: ${props => (!props.active ? "normal" : "italic")};
`;

export const navIcon = css`
  border-bottom: 0;
  margin-right: 1em;

  img {
    width: 35px;
  }
`;

export const content = css`
  max-width: 800px;
  display: block;
  width: 100%;
  flex: 1 0 auto;
  margin: 0 auto;
`;

export const nav = css`
  border-bottom: 4px solid black;
  margin: 0 auto;
  display: flex;
  align-items: center;
  margin-bottom: 1em;
  padding: 5px 0;

  @media (max-width: 800px) {
    padding: 5px 10px;
  }
`;

export const main = css`
  @media (max-width: 800px) {
    padding: 0 10px;
  }
`;

export const footer = css`
  flex-shrink: 0;
  padding-left: 10px;
  padding-bottom: 10px;
  margin-top: 25px;
`;
