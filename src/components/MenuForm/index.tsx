/* eslint-disable no-nested-ternary */
import {
  Box,
  Button,
  Center,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import Svg from 'react-inlinesvg';
import isURL from 'is-url';
import { debounce } from 'lodash';
import {
  Menu,
  setMenuAction,
  useMenuContext,
} from '../../contextes/MenuContext';

const ACTION_HANDLE_INPUT = 'ACTION_HANDLE_INPUT';
const ACTION_CLEAR_FORM = 'ACTION_CLEAR_FORM';

type Action =
  | {
      type: typeof ACTION_HANDLE_INPUT;
      field: keyof Menu;
      payload: string;
    }
  | {
      type: typeof ACTION_CLEAR_FORM;
    };

const initialValue: Menu = {
  iconSrc: '',
  name: '',
};

const reducer = (state: Menu, action: Action): Menu => {
  switch (action.type) {
    case ACTION_HANDLE_INPUT:
      return {
        ...state,
        [action.field]: action.payload,
      };

    case ACTION_CLEAR_FORM:
      return initialValue;

    default:
      return state;
  }
};

const MenuForm = () => {
  const [menuState, menuDispatch] = useMenuContext();
  const [formState, formDispatch] = useReducer(reducer, initialValue);
  const [svgError, setSvgError] = useState<any>(null);
  const toast = useToast();

  const handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (svgError || !isURL(formState.iconSrc)) {
      toast({
        title: 'Data cannot be submitted',
        description: 'Please check your input',
        status: 'error',
        isClosable: true,
        duration: 3000,
      });

      return;
    }

    const newMenuState = [...menuState.menus];
    newMenuState.push(formState);
    menuDispatch(setMenuAction(newMenuState));
    toast({
      title: 'Menu created',
      status: 'success',
      isClosable: true,
      duration: 2000,
    });

    formDispatch({ type: ACTION_CLEAR_FORM });
  };

  const handleInputChange = (field: keyof Menu, value: string) => {
    formDispatch({ type: ACTION_HANDLE_INPUT, field, payload: value });
  };

  const handleSvgFetchError = (errorSvg: any) => {
    setSvgError(errorSvg);
  };

  const debouncedClearError = useCallback(
    debounce(() => {
      setSvgError(null);
    }, 300),
    [],
  );

  useEffect(() => {
    debouncedClearError();
  }, [formState.iconSrc]);

  return (
    <form onSubmit={handleFormSubmit}>
      <FormControl isRequired>
        <FormLabel htmlFor="name">Name</FormLabel>
        <Input
          id="name"
          name="name"
          placeholder="Menu Name"
          value={formState.name}
          onChange={(ev) => handleInputChange('name', ev.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="icon-src">Icon URL</FormLabel>
        <Input
          id="icon-src"
          name="iconSrc"
          placeholder="https://svg-host/your-icon.svg"
          value={formState.iconSrc}
          onChange={(ev) => handleInputChange('iconSrc', ev.target.value)}
        />
        <FormHelperText>The URL of svg icon you will use</FormHelperText>
        <Text mt={4}>Preview</Text>
        <Box
          mt={2}
          border="1px solid"
          borderColor="teal"
          borderRadius="1rem"
          padding={2}
          h="6rem"
          w="6rem"
          as={Center}
        >
          {formState.iconSrc && isURL(formState.iconSrc) && !svgError ? (
            <Icon
              as={Svg}
              onError={handleSvgFetchError}
              src={formState.iconSrc}
              fontSize="4rem"
              color="teal"
            />
          ) : !formState.iconSrc ? (
            <Text textAlign="center">Fill the URL</Text>
          ) : svgError ? (
            <Text textAlign="center">Failed to fetch SVG file</Text>
          ) : (
            <Text textAlign="center">URL is not valid</Text>
          )}
        </Box>
      </FormControl>
      <HStack>
        <Box flexGrow={1} />
        <Button colorScheme="teal" type="submit">
          Submit
        </Button>
      </HStack>
    </form>
  );
};

export default MenuForm;
