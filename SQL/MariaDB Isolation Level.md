# InnoDB Lock Modes

Transaction acquires locks to prevent concurrent transactions from modifying, or even reading, some rows and ensure concurrent write operations never collide.

## Standard row-level locks:

- Shared lock (`S`) 
  - Use to read a row 
  - Allow other transactions reading the locked row but not writing into the locked row
  - Other transactions can acquire their own shared lock
- eXclusive lock (`X`)
 - Use to write into a row
 - Other transactions can not locking the row
 - Behaviour depend on the isolation level. Default: `REPEATABLE READ`

## Intention locks

It is a series of locks which allow table level locking and row level locking are used at the same time.
- Intention Shared lock (`IS`): a transaction intends to set a Shared lock
- Intention eXclusive lock (`IX`): a transaction intends to set an eXclusive lock.

## Lock granting criteria:

- `X` lock is only granted if there are no any other locks (X, S, IX, IS) are held.
- `S` lock is granted if both X and IX are not held.
- `IX` lock is granted if both X and S are not held.
- `IS` lock is granted if X lock is not held.

## AUTO_INCREMENT lock modes (`innodb_autoinc_lock_mode`):

- Traditional `0`: table-level lock for all INSERT statements
- Consecutive `1`: 
  - Default setting
  - Table-level lock for bulk `INSERT` statements, e.g. `LOAD DATA`, `INSERT ... SELECT ...`
  - No table-level lock is acquired for simple `INSERT` statements. Using mutex insead.
- Interleaved `2`: 
  - Do not acquire any table-level lock
  - It is the fastest and most scalable mode, but it is not safe for statement-based replication.

> Mutex (mutual exclusion) ensure that no concurrent access at the given time to prevent race conditions, data corruption, and unpredictable behavior.

## Gap lock 

It is a lock on specified scope. e.g. between index records, before the first index or after the last index record.
It can be a single index value, multiple index values, or even be empty. 
It is set when setting a Shared lock or eXclusive lock on a record.

> Shared lock or eXclusive lock actually set on the index.
> It does not care whether unique index is defined or not. Every record has an internal index.

Type of the gap Lock:
- Shared gap lock
- Exclusive gap lock
- Intention shared gap lock 
- Intention exclusive gap lock

Gap lock is not in effect if a statement uses all the columns of a unique index to search for unique row.

Gap lock will be disabled if 
- Transaction isolation level is set to `READ COMMITTED`, or
- Setting `innodb_locks_unsafe_for_binlog` is set to `1`. (Removed since MariaDB 10.5)

# Isolation Level

It can be changed by `transaction-isolation` option. 
Option values are `READ_UNCOMMITTED`, `READ-COMMITTED`, `REPEATABLE-READ`, or `SERIALIZABLE`.

- `READ UNCOMMITTED`: aka. dirty read.
  - No isolation
  - Read the update data that made by other transactions even it is no committed yet
  - Wrong data, due to rollback may occurred, may be retrieved
  - High performance due to no overhead on the locks
- `READ COMMITTED`: default level of most RDBMS but not with MariaDB
  - Create a new snapshot from committed data just before `SELECT` statement.
  - Can get difference result during same transaction. This phenomenon is called **non-repeatable read**.
- `REPEATABLE READ`: default level for InnoDB
  - Snapshot will be created from committed data at the first execution of the `SELECT` statement.
  - Same snapshot will be used for same `SELECT` statement.
  - Maintain snapshot cause extra overhead and impact some performance.
  - Although non-repeatable read is solved, another problem, called **phantom read**, is occurred.
- `SERIALIZABLE`
  - Completely isolation
  - It is similar to `REPEATABLE READ` with extra restriction that row selected by one transaction can not be changed by another until the transaction is finished.
  - The phenomenon of phantom read is avoided.

> Example of phantom read:  
> `SET @usr = COUNT(user); .... SET @usr = COUNT(user);`  
> Difference result will be retrieved when rows are inserted by another transaction between two statements.
