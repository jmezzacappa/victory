import { VictoryCommonProps } from "./common-props";
import React from "react";
import { useVictoryContext, VictoryProviderProps } from "../victory-state";
import { withProvider } from "../victory-state/victory-provider-maybe";

export function withNormalizedProps<
  TProps extends VictoryCommonProps & {
    children?: React.ReactNode | React.ReactNode[];
  },
  TDefaultPropKeys extends keyof TProps,
>(
  config: {
    displayName: string;
    defaultProps: Pick<TProps, TDefaultPropKeys>;
  },
  WrappedComponent: React.FC<TProps>,
  initialProviderProps: Partial<VictoryProviderProps> = {},
) {
  WrappedComponent.displayName = config.displayName;
  const WithContainer = (props: TProps) => {
    const normalizedProps = useVictoryContext((v) => v);

    return (
      <WrappedComponent {...props} {...normalizedProps}>
        {props.children}
      </WrappedComponent>
    );
  };
  WithContainer.displayName = `WithContainer(${config.displayName})`;
  WithContainer.defaultProps = config.defaultProps;
  // Give `propTypes` a strong type:
  type StrongPropTypes =
    | undefined
    | Required<React.WeakValidationMap<Omit<TProps, keyof VictoryCommonProps>>>;
  WithContainer.propTypes = undefined as StrongPropTypes;

  return withProvider(WithContainer);
}
