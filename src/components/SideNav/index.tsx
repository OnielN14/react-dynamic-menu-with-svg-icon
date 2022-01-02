/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Center,
  Heading,
  Icon,
  StackProps,
  ThemingProps,
  VStack,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { FiHexagon } from 'react-icons/fi';
import Svg from 'react-inlinesvg';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, useMenuContext } from '../../contextes/MenuContext';

interface SidenavMenuProps {
  leftIcon?: React.ReactElement;
  active?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

interface SidenavMenuIconProps {
  src: string;
}

const SidenavMenuIcon = ({ src }: SidenavMenuIconProps) => (
  <Icon as={Svg} src={src}>
    <FiHexagon />
  </Icon>
);

const buttonTransitionVariants = {
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
};

const SidenavMenu = ({
  children,
  leftIcon,
  active,
  onClick,
}: SidenavMenuProps) => {
  const variantType: ThemingProps<'Button'>['variant'] = active
    ? 'solid'
    : 'ghost';

  return (
    <Button
      as={motion.button}
      variants={buttonTransitionVariants}
      onClick={onClick}
      flexGrow="1"
      isFullWidth
      justifyContent="flex-start"
      colorScheme="teal"
      leftIcon={leftIcon}
      variant={variantType}
    >
      {children}
    </Button>
  );
};

SidenavMenu.defaultProps = {
  leftIcon: null,
  active: false,
  onClick: null,
};

const menuListVariant = {
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  hide: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

interface SidenavProps extends StackProps {}

const Sidenav = (props: SidenavProps) => {
  const [{ menus }] = useMenuContext();
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const handleMenuOnClick = (menu: Menu) => {
    setSelectedMenu(menu);
  };

  return (
    <VStack width={200} paddingX={4} padding={2} height="100%" {...props}>
      <Center height={14}>
        <Heading as="h1" size="md">
          App Name
        </Heading>
      </Center>
      <AnimatePresence>
        <VStack
          as={motion.div}
          variants={menuListVariant}
          width="100%"
          spacing={2}
          alignItems="flex-start"
          initial="hide"
          animate="show"
        >
          {menus.map((menu) => (
            <SidenavMenu
              key={menu.name}
              onClick={() => handleMenuOnClick(menu)}
              active={Object.is(selectedMenu, menu)}
              leftIcon={<SidenavMenuIcon src={menu.iconSrc} />}
            >
              {menu.name}
            </SidenavMenu>
          ))}
        </VStack>
      </AnimatePresence>
    </VStack>
  );
};

const StyledSidenav = styled(Sidenav)`
  box-shadow: 0px 0px 15px 5px rgb(0 0 0 / 20%);
`;

export default StyledSidenav;
