import { useState } from 'react';
import DialogFooter from '../common/DialogFooter';
import { Box, Button, CircularProgress, DialogContent, Stack, Typography } from '@mui/material';
import { useVirtualizer } from '@tanstack/react-virtual';
import BaseDialog from '../common/BaseDialog';
import ListItem from '../common/ListItem';

export type ItemListDialogItem = {
  id: string;
  to: string;
  title: string;
  detailText: string;
  status: string;
  score: number;
  imageUrl: string | null;
};

type ItemListDialogProps = {
  title: string;
  visible: boolean;
  closeDialog: () => void;
  items: ItemListDialogItem[] | undefined;
  isLoading: boolean;
};

export default function ItemListDialog({
  title,
  visible,
  closeDialog,
  items,
  isLoading,
}: ItemListDialogProps) {
  // State instead of a ref, so the list re-renders once the scroll element exists.
  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null);

  return (
    <BaseDialog
      title={title}
      open={visible}
      onClose={closeDialog}
      fullWidth
      slotProps={{ paper: { sx: { height: { md: 'min(700px, calc(100% - 64px))' } } } }}
    >
      <DialogContent ref={setScrollElement} sx={{ pt: 0, scrollbarGutter: 'stable' }}>
        {isLoading ? (
          <Stack direction="row" sx={{ justifyContent: 'center' }}>
            <CircularProgress />
          </Stack>
        ) : null}
        {!isLoading && items?.length && scrollElement ? (
          <VirtualItemList items={items} scrollElement={scrollElement} />
        ) : null}
        {!isLoading && items?.length === 0 ? <Typography>List empty</Typography> : null}
      </DialogContent>
      <DialogFooter>
        <Button color="inherit" onClick={closeDialog}>
          Close
        </Button>
      </DialogFooter>
    </BaseDialog>
  );
}

const GAP = 12;
const PADDING = 8;
const ESTIMATED_ITEM_HEIGHT = 160;

type VirtualItemListProps = {
  items: ItemListDialogItem[];
  scrollElement: HTMLDivElement;
};

/**
 * Renders only the items near the viewport, so long lists (thousands of items) open quickly.
 * Items stay in normal flow inside the list, with padding standing in for the skipped ones.
 */
function VirtualItemList({ items, scrollElement }: VirtualItemListProps) {
  // React Compiler skips memoizing this component, which the virtualizer needs to update on scroll.
  // oxlint-disable-next-line react/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => ESTIMATED_ITEM_HEIGHT,
    getItemKey: (index) => items[index].id,
    gap: GAP,
    paddingStart: PADDING,
    paddingEnd: PADDING,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const first = virtualItems[0];
  const last = virtualItems.at(-1);

  return (
    <Box
      component="ul"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: `${GAP}px`,
        listStyle: 'none',
        m: 0,
        px: `${PADDING}px`,
        boxSizing: 'border-box',
      }}
      style={{
        paddingTop: first?.start ?? PADDING,
        paddingBottom: last ? virtualizer.getTotalSize() - last.end : PADDING,
      }}
    >
      {virtualItems.map((virtualItem) => {
        const item = items[virtualItem.index];
        return (
          <ListItem
            lighten
            key={virtualItem.key}
            ref={virtualizer.measureElement}
            data-index={virtualItem.index}
            to={item.to}
            title={item.title}
            detailText={item.detailText}
            status={item.status}
            score={item.score}
            itemId={item.id}
            imageUrl={item.imageUrl}
          />
        );
      })}
    </Box>
  );
}
