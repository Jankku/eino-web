import { Card, CardContent, CircularProgress, Grid, ImageList, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { StatsStatusTable } from './StatsStatusTable';
import { BarChart } from './BarChart';
import { StatsItem } from './StatsItem';
import { StatusProgressBar } from './StatusProgressBar';
import { Profile } from '../../../data/profile/profile.types';
import { useReducer, useState } from 'react';
import ItemListDialog from '../ItemListDialog';
import { getProgressValues } from '../../../utils/chartUtils';
import { useMovies } from '../../../data/movies/useMovies';
import ListItem from '../../common/ListItem';

const formatter = new Intl.NumberFormat();

const statuses = ['completed', 'watching', 'on-hold', 'dropped', 'planned'];

type MovieStatsProps = {
  stats: Profile['stats']['movie'];
};

export function MovieStats({ stats }: MovieStatsProps) {
  const [listDialogOpen, toggleListDialog] = useReducer((open) => !open, false);
  const [selectedScore, setSelectedScore] = useState<number>();
  const { data, isLoading, isSuccess } = useMovies({
    enabled: listDialogOpen && selectedScore !== undefined,
    status: 'all',
    filter: `score:=:${selectedScore}`,
  });

  const scoreCounts = stats.score_distribution.map((item) => item.count);

  const progressValues = getProgressValues(stats.count);

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
            <Grid
              container
              columns={1}
              sx={{
                rowGap: 2,
              }}
            >
              <Grid
                container
                sx={{
                  rowGap: 1,
                }}
              >
                <Grid
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
                </Grid>
                <Grid
                  container
                  item
                  sx={{
                    rowGap: 1,
                    width: '100%',
                  }}
                >
                  <StatusProgressBar data={progressValues} total={stats.count.all} />
                  <StatsStatusTable stats={stats} statuses={statuses} />
                </Grid>
              </Grid>
              <BarChart
                labels={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                data={scoreCounts}
                onClick={onBarClick}
              />
            </Grid>
          </Box>
        </CardContent>
      </Card>
      <ItemListDialog
        title={`Movies with score ${selectedScore}`}
        visible={listDialogOpen}
        closeDialog={toggleListDialog}
      >
        {isLoading ? (
          <Grid
            container
            sx={{
              justifyContent: 'center',
            }}
          >
            <CircularProgress />
          </Grid>
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
