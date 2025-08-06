import {useFind} from 'meteor/react-meteor-data'
import {DraftProgressDocument} from '/imports/core/domain/entities/draft-progress'
import {DraftProgressCollection} from '/imports/core/infrastructure/db/draft-progress'
import {useSubscribe} from '/imports/rpc/rpc-hooks'

export function useDraftSubscription(): [ boolean, DraftProgressDocument ] {
  const isLoading = useSubscribe("draft.progress");

  const data = useFind(() => DraftProgressCollection.find({}, {}), []);
  return [
    isLoading(),
    data[0]
  ]
}
