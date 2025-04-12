import {
  Card,
  CardContent,
  CircularProgress,
  GridLegacy,
  ImageList,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { StatsStatusTable } from './StatsStatusTable';
import { BarChart } from './BarChart';
import { StatsItem } from './StatsItem';
import { StatusProgressBar } from './StatusProgressBar';
import { Profile } from '../../../data/profile/profile.types';
import { useMemo, useState } from 'react';
import ItemListDialog from '../ItemListDialog';
import { getProgressValues } from '../../../utils/chartUtils';
import { useMovies } from '../../../data/movies/useMovies';
import ListItem from '../../common/ListItem';
import { useToggle } from '@uidotdev/usehooks';
import { useIsMobile } from '../../../hooks/useIsMobile';

const formatter = new Intl.NumberFormat();

const statuses = ['completed', 'watching', 'on-hold', 'dropped', 'planned'];

type MovieStatsProps = {
  stats: Profile['stats']['movie'];
};

export function MovieStats({ stats }: MovieStatsProps) {
  const isMobile = useIsMobile();
  const [listDialogOpen, toggleListDialog] = useToggle(false);
  const [selectedScore, setSelectedScore] = useState<number>();
  const { data, isLoading, isSuccess } = useMovies({
    enabled: listDialogOpen && selectedScore !== undefined,
    status: 'all',
    filter: `score:=:${selectedScore}`,
  });

  const labels = useMemo(
    () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (isMobile ? score : `⭐${score}`)),
    [isMobile],
  );
  const scoreCounts = useMemo(
    () => stats.score_distribution.map((item) => item.count),
    [stats.score_distribution],
  );
  const progressValues = useMemo(() => getProgressValues(stats.count), [stats.count]);

  const onBarClick = (index: number) => {
    setSelectedScore(index + 1);
    toggleListDialog();
  };

  return (
    <>
      <Card component="section" variant="outlined">
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              px: 2,
            }}
          >
            <h2>Movie stats</h2>
            <GridLegacy
              container
              columns={1}
              sx={{
                rowGap: 2,
              }}
            >
              <GridLegacy
                container
                sx={{
                  rowGap: 1,
                }}
              >
                <GridLegacy
                  component="dl"
                  container
                  sx={{
                    justifyContent: 'space-between',
                    m: 0,
                  }}
                >
                  <StatsItem
                    title={'Watch time:'}
                    text={`${formatter.format(stats.watch_time)} hours`}
                  />
                  <StatsItem title={'Average score:'} text={stats.score_average} />
                </GridLegacy>
                <GridLegacy
                  container
                  item
                  sx={{
                    rowGap: 1,
                    width: '100%',
                  }}
                >
                  <StatusProgressBar data={progressValues} total={stats.count.all} />
                  <StatsStatusTable stats={stats} statuses={statuses} />
                </GridLegacy>
              </GridLegacy>
              <BarChart labels={labels} data={scoreCounts} onClick={onBarClick} />
              <Typography variant="body2" color="textSecondary" width="100%" textAlign="center">
                Click on a bar to view movies with that score
              </Typography>
            </GridLegacy>
          </Box>
        </CardContent>
      </Card>
      <ItemListDialog
        title={`Movies with score ${selectedScore}`}
        visible={listDialogOpen}
        closeDialog={toggleListDialog}
      >
        {isLoading ? (
          <GridLegacy
            container
            sx={{
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </GridLegacy>
        ) : null}
        {!isLoading && data?.length ? (
          <ImageList cols={1} gap={12}>
            {data?.map((movie) => (
              <ListItem
                lighten
                disableClick
                key={movie.movie_id}
                title={movie.title}
                detailText={movie.director}
                status={movie.status}
                score={movie.score}
                itemId={movie.movie_id}
                imageUrl={movie.image_url}
              />
            ))}
          </ImageList>
        ) : undefined}
        {isSuccess && data?.length === 0 ? <Typography>List empty</Typography> : null}
      </ItemListDialog>
    </>
  );
}
