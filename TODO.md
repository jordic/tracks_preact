
How drive sync should work?


> Check upstream changes.

  > If upstream is behind our log. 
      Is safe to push our log.
  
  > If upstream has new changes...
      We need to fetch them and recalculate state.
  
  > We need to check if there are new track created... 
    but without any log commit.
  
  > What will happen if both (upstream, and local) had
    evolved in parallel? 
    
    > We need to reconciliate them... 

      - Merge each finished entry.
      - Merge opened tracks taking the oldest one.

  
> We don't want to trigger automatic sync on first release. 
> Perhaps just a button on header that allows to sync.

